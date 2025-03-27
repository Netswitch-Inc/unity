/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { createAttachment } from "./attachmentStore/index.js";
import { getAttachmentList } from "./attachmentStore/index.js";
import { getHistoryList } from "./projectHistoryStore/index.js";

// ** Utils
import { formatFileSize } from "utility/Utils.js";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner.js";

// ** SVG Icons
import uploadIcon from "../../assets/img/upload.svg"
import downloadIcon from "../../assets/img/download.svg"

const Attachments = () => {
  // ** Hooks
  const { id } = useParams()
  const dispatch = useDispatch();

  // ** Store Vars
  const store = useSelector((state) => state.attachments)
  const loginStore = useSelector((state) => state.login);
  const projectStore = useSelector((state) => state.projects);

  // ** Const
  const allowed = projectStore.projectItem?.status === 'created'
  const authUserItem = loginStore?.authUserItem?._id ? loginStore?.authUserItem : null;

  useLayoutEffect(() => {
    dispatch(getAttachmentList({ project_id: id }))
  }, [dispatch])

  useEffect(() => {
    if (store?.actionFlag === 'ATACHMNT_CRTD_SCS') {
      dispatch(getAttachmentList({ project_id: id }))
      dispatch(getHistoryList({ project_id: id }))
    }
  }, [store?.actionFlag])


  // Handle file selection
  const pickAttachmentHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = ".ppt,.pptx,.pdf,.doc,.docx,.png,.jpg,.jpeg,.html,.txt,.csv,.xls,.xlsx";
    input.onchange = (e) => {
      const selectedFiles = Array.from(e.target.files).map(file => ({
        title: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        image: URL.createObjectURL(file),
        file: file // Keep the file object for future use
      }));

      const formData = new FormData();
      formData.append('file', selectedFiles[0]?.file);
      formData.append('project_id', id)
      formData.append('user_id', authUserItem._id ? authUserItem._id : '')
      formData.append('company_id', authUserItem.company_id?._id ? authUserItem.company_id?._id : '')
      formData.append('type', 'Attachment')
      formData.append('projectHistoryDescription', `An Attachment named ${selectedFiles[0]?.file?.name} is uploaded by`)
      dispatch(createAttachment(formData))
    };
    input.click();
  }

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFiles = Array.from(event.dataTransfer.files).map(file => ({
      title: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      image: URL.createObjectURL(file),
      file: file // Keep the file object for future use
    }));

    const formData = new FormData();
    formData.append('file', droppedFiles[0]?.file);
    formData.append('project_id', id)
    formData.append('user_id', authUserItem._id ? authUserItem._id : '')
    formData.append('company_id', authUserItem.company_id?._id ? authUserItem.company_id?._id : '')
    formData.append('type', 'Attachment')
    formData.append('projectHistoryDescription', `An Attachment named ${droppedFiles[0]?.file?.name} is uploaded by`)
    dispatch(createAttachment(formData))
  }

  // Prevent default behavior for drag over
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const downloadAttachmentHandler = (url, fileName) => {
    fetch(url).then((response) => response.blob()).then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }).catch((error) => {
      console.error("Error fetching the file:", error);
    })
  }

  return (<>
    {allowed ? (
      <div className={"attachment-container"} onDrop={handleDrop}
        onDragOver={handleDragOver}>
        <div className={"upload-container"} onClick={pickAttachmentHandler}>
          <img
            className="image"
            alt="dropFileIcon"
            src={uploadIcon}
          />
          <p className="text">Drop files here or click to upload</p>
        </div>
      </div>
    ) : null}

    <div className="main-upload-image">
      {!store?.loading ? (
        <SimpleSpinner />
      ) : null}

      {store?.attachmentItems.map((item) => {
        return (
          <div key={item._id} className={"attachment-item mt-2 d-flex align-items-baseline"}>
            <div className="w-75">
              <div className="text-container">
                <p className="title">{item.name}</p>
                <p className="subtitle">{formatFileSize(item.file_size)}</p>
                <div style={{ flex: 1 }} />
              </div>
            </div>

            <div className="w-25 text-right">
              <img
                width={16}
                height={16}
                alt="Download"
                src={downloadIcon}
                className="m-0 download-image cursor-pointer text-white"
                onClick={() => downloadAttachmentHandler(`${process.env.REACT_APP_BACKEND_REST_API_URL}/${item.file_path}`, item?.name)}
              />
            </div>
          </div>
        )
      })}

      {store?.attachmentItems?.length === 0 ? (
        <p>There are no records to display</p>
      ) : null}
    </div>
  </>)
}

export default Attachments;
