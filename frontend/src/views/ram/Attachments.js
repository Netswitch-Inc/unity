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
            alt="dropFileIcon"
            className={"image"}
            src={
              "data:image/png;base64,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"
            }
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
              <div className={"text-container"}>
                <p className={"title"}>{item.name}</p>
                <p className={"subtitle"}>{formatFileSize(item.file_size)}</p>
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
