'use client'

import SingleAlbumViewUser from "@/app/Album-Portfolio/album/components/SingleAlbumViewUser";
import {useParams} from "next/navigation";

export default function SingleAlbumPage(){

    const {albumID} = useParams()

    return(
        <div>
           <SingleAlbumViewUser />
        </div>
    )
}