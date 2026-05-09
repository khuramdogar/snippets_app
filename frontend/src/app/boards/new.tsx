"use client";
import React, { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard } from "lib/api/board";
import Modal from "../modal/modal";

import styles from "./home.module.scss";

interface ModalProps {
    open: boolean
    toggleModal: () => void;
}

const Board = (props: ModalProps): ReturnType<FC> => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setPublic] = useState(false);
    const createBoardMutation = useMutation({
        mutationFn: createBoard,
        mutationKey: ['create boards'],
        onSuccess: (data: any) => {
          console.log('Board created successfully:', data);
          queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
        onError: (error: any) => {
          console.error('Board creation failed:', error.message);
        },
    });
    
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const board = { board: { title, description, is_public: isPublic } };
        createBoardMutation.mutate(board, {
            onSuccess: (res) => {
                console.log('Board created:', res);
                setTitle("");
                setDescription("");
                setPublic(false);
                props.toggleModal();
            },
        });
    };

    return (
        <>
            <div>
                <Modal open={props.open} heading="Create Your Board" toggleModal={props.toggleModal}>
                    <div className={styles.form_container}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.form_control}>
                                <input 
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={styles.inputText}
                                    required
                                />
                                <span className={styles.floating_label}>Board Name</span>
                            </div>
                            <div className={styles.form_control}>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={styles.textarea} 
                                    placeholder="Description" 
                                />
                                {/* <span className={styles.floating_label}>Board Description</span> */}
                            </div>
                            <div className={styles.form_control}>
                                <label>
                                    Is Public?
                                    <input 
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={(e) => setPublic(e.target.checked)}
                                        name="isPublic"
                                    />
                                </label>
                            </div>
                            <button type="submit" className={styles.btn}>Create Board</button>
                        </form>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default Board;
