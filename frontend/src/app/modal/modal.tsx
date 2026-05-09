import { FC, ReactElement } from "react";
import styles from "./modal.module.scss";

interface ModalProps {
    open: boolean;
    heading: string;
    toggleModal: () => void;
    children: ReactElement;
}

export default function Modal(props: ModalProps): ReturnType<FC> {
    const modal_classess = `${styles.modal} ${props.open ? styles.display_block : styles.display_none}`
    return (
        <div className={modal_classess}>
            <div className={styles.modal_main}>
                <div className={styles.modal_head}>
                    <h1>{props.heading}</h1>
                    <div className={`${styles.close_button} ${styles.topright}`} onClick={props.toggleModal}>X</div>
                </div>
                <div className={styles.modal_body}>
                    {props.children}
                </div>
                {/* <div className={styles.btn_container}>
                    <button type="button" className={styles.btn} onClick={props.onClose}>Close</button>
                </div> */}
            </div>
        </div>
    );
}