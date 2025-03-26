/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createComment, getCommentList } from "./commentStore";
import { useParams } from "react-router-dom";
import { onImageSrcError } from "utility/Utils";
import defaultAvatar from "assets/img/avatar-default.jpg";
import { getHistoryList } from "./projectHistoryStore";
import { timeAgo } from "utility/Utils";
import SimpleSpinner from "components/spinner/simple-spinner";

const Comments = () => {
  const [inputVal, setInputVal] = useState('')
  const dispatch = useDispatch();
  const { id } = useParams();
  const store = useSelector((state) => state.comments);
  const loginStore = useSelector((state) => state.login);
  const authUserItem = loginStore?.authUserItem?._id
    ? loginStore?.authUserItem
    : null;

  const projectStore = useSelector((state) => state.projects);
  const allowed = projectStore.projectItem?.status === 'created'


  useEffect(() => {
    if (store?.actionFlag === 'COMMENT_CRTD_SCS') {
      dispatch(getCommentList({ project_id: id }))
      dispatch(getHistoryList({ project_id: id }))
    }
  }, [store?.actionFlag])

  useLayoutEffect(() => {
    dispatch(getCommentList({ project_id: id }))
  }, [dispatch])

  const addCommentHandler = () => {
    const payloadData = {
      project_id: id,
      company_id: authUserItem.company_id?._id ? authUserItem.company_id?._id : null,
      user_id: authUserItem?._id ? authUserItem?._id : null,
      date: new Date(),
      description: inputVal,
      type: 'Comment',
      projectHistoryDescription: `A comment has been posted by`,
      status: 1
    }
    if (inputVal !== '') {
      dispatch(createComment(payloadData))
      setInputVal(() => '')
    }
  };

  return (
    <>
      <div className={"comments-container"}>
        <div className={"comment-items-container"}>
          {!store?.loading ? (
            <SimpleSpinner />
          ) : null}
          {store.commentItems?.length > 0 && store.commentItems.map((item) => {
            return (
              <div key={item._id} className={"comment-item"}>
                <div className={"content-container"}>
                  <img
                    alt="avatar"
                    className={"user-avatar"}
                    src={item.image ? `${process.env.REACT_APP_BACKEND_REST_API_URL}/${item.image}` : defaultAvatar}
                    onError={(currentTarget) => onImageSrcError(currentTarget, defaultAvatar)}
                  />
                  <div className={"text-container"}>
                    <div className={"username-timestamp-container"}>
                      <p className={"user-name"}>{item.user_id?.user_name}</p>
                      <p className={"time-stamp"}>{timeAgo(item?.date)}</p>
                    </div>
                    <p className={"comment-text"}>{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {allowed && <div className={"input-container mb-2"}>
          <textarea className={"input-text"} placeholder={"Your comment..."} value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
          <div className={"input-menu"}>
            <div className={"option-items-container"}>
              <div className={"option-button"} />
              <div className={"option-button"} />
              <div className={"option-button"} />
            </div>
          </div>
        </div>}
        <div className="buttons w-100">
              <button className={"btnprimary w-100"} onClick={addCommentHandler}>
                Add comment
              </button>
            </div>
      </div>
    </>
  );
};

export default Comments;
