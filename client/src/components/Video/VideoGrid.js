import React from "react";
import { makeStyles, Grid } from "@material-ui/core";

import VideoCard from "./VideoCard";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { BACKEND_URL } from "../../config";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function VideoGrid({ isLoading, videos, type ,isChannel }) {
  const classes = useStyles();
  const api = axios.create({
    withCredentials: true,
    baseURL: BACKEND_URL,
  });
  
    const handleDelete = async (e,id) => {
      e.stopPropagation()
      try {
        await api.post(`/api/videos/delete/${id}`);
        // console.log(id)
        window.location.href =`/`
      }
      catch (err) {
        console.log(err)
      }
    }
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {!isLoading
          ? videos.map(
              (
                {
                  id,
                  description,
                  duration,
                  channelName: uploader,
                  channelId,
                  createdAt,
                  thumbnailLink: thumbnail,
                  title,
                  videoLink: video,
                  views,
                  channelImg,
                },
                i
              ) => (
                <Grid key={id} item xs={12} sm={6} md={4} lg={3}>
                  <VideoCard
                    type={type}
                    channelImg={channelImg}
                    key={id}
                    description={description}
                    id={id}
                    channelId={channelId}
                    date={createdAt}
                    videoLink={video}
                    title={title}
                    channel={uploader}
                    views={views}
                    thumbnail={thumbnail}
                    duration={duration}
                  />
                  {isChannel && <div onClick={(e)=> handleDelete(e,id)}><DeleteIcon style={{cursor:"pointer"}} /></div>}
                </Grid>
              )
            )
          : new Array(8).fill(
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <VideoCard isLoading={isLoading} type={type}/>{" "}
              </Grid>
            )}
      </Grid>
    </div>
  );
}
