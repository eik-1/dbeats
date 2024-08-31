import React from "react"
import { useRouteError, useNavigate } from "react-router-dom"
import styles from "./Error.module.css"

const Error = () => {
    const error = useRouteError()
    const navigate = useNavigate()

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Oops! Something went wrong.</h1>
            <p className={styles.message}>
                {error.statusText ||
                    error.message ||
                    "An unexpected error occurred."}
            </p>
            <button className={styles.button} onClick={() => navigate("/")}>
                Go to Home
            </button>
        </div>
    )
}

export default Error
