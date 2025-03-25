/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import ReplyModal from "@/app/feedback/components/ReplyModel";
import {useState} from "react";


export default function Home() {
    // State to control modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Example feedbackId (can be dynamic)
    const feedbackId = "123"; // Replace with the actual feedback ID from your database or API

    // onCloseAction function to close the modal
    const onCloseAction = () => {
        setIsModalOpen(false); // This will hide the modal when called
        return (
            <div>
                {/*<Link href="/Album-Portfolio/albumShow/">*/}
                {/*    Show Albums*/}
                {/*</Link>*/}
                {/*<br/>*/}
                {/*<Link href="/Album-Portfolio/uploadAlbum/">*/}
                {/*    Upload New Album*/}
                {/*</Link>*/}

                {/* Button to open the modal */}
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    Open Reply Modal
                </button>

                {/* Conditionally render the ReplyModal */}
                {isModalOpen && (
                    <ReplyModal feedbackId={feedbackId} onCloseAction={onCloseAction}/>
                )}
            </div>
        );
    }
}