import React, { Fragment } from "react";
import { Dialog, DialogContent } from "@mui/material";
import UpdatePost from "./UpdatePost.js";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { serverUrl } from "../../constants.js";
import { toast } from "react-toastify";

const UpdatePostDialog = ({
  open,
  onClose,
  postId,
  image,
  title,
  description,
}) => {
  const handleDeletePost = async () => {
    const deletemsg = prompt("Do you really want to delete post", "yes/no");
    if (deletemsg === "yes") {
      const { data } = await axios.delete(
        `${serverUrl}/post/delete/${postId}`,
        {
          withCredentials: true,
        }
      );
      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } else {
      toast.success("post prevented from being delete");
    }
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{ style: { minWidth: "80vw", minHeight: "80vh" } }}
      >
        <DialogContent>
          <div className="delete-icon">
            <div>
              <div className="delete-post" onClick={handleDeletePost}>
                <DeleteIcon
                  style={{ color: "red", height: 50, float: "right" }}
                />
              </div>
            </div>
          </div>
          <UpdatePost
            postId={postId}
            image={image}
            titled={title}
            desc={description}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default UpdatePostDialog;
