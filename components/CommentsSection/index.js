import React,{useState} from "react";
import Style from "./CommentSection.module.css";
import CommentItem from "./CommentItem.js";
import { Typography} from "antd";
import { useUser } from "@auth0/nextjs-auth0";
import useBackend from "../../utils/hooks/useBackend";
import moment from "moment"


export default function CommentsSection({ comments, location }) {


    const { user } = useUser()
    const {addUser, methods} = useBackend({user_id: user?.sub, username:user?.name})
    const { Paragraph } = Typography;
    const [editableStr, setEditableStr] = useState(
        "Comment about this charge point"
      );

      function sendComment(message){
    
       addUser(methods.COMMENT,
        {
            location: location,
            comment : message,
            date : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            visibility: true,
        }
        )
      }
  return (
    <>
      <div className={Style.comment_section}>
        <p>Comment section:</p>
        
        {comments?.map(v => {
          return <CommentItem author={v.username} comment={v.comment} />;
        })}

        {user&&
        <Paragraph editable={{ onChange: (message) => sendComment(message) }}>
          {editableStr}
        </Paragraph>
        }

      </div>
    </>
  );
}
