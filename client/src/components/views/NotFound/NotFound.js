import React from 'react'
import { FaRegSadTear } from "react-icons/fa";

function NotFound() {
    return (
        <>
            <div className="app">
                <FaRegSadTear style={{ fontSize: '4rem' }} /><br />
                <span style={{ fontSize: '2rem' }}>Not found or missing content</span>
            </div>
            {/* <div style={{ float: 'right' }}>Thanks For Using This Boiler Plate by John Ahn</div> */}
        </>
    )
}

export default NotFound
