import styles from "./profile.module.scss";
import { useState } from "react";
import { useLoaderData, Link } from "@remix-run/react";
import ProfileController from "../../.server/controllers/userController/profileController";
import Board from "../board/new";

import banner from "../../assets/banner.png";

export const loader = async () => {
    try {
        const data = await ProfileController.boards();
        return data;
    } catch (error) {
        console.error('Error loading profile data:', error);
        return []; // Return an empty array or appropriate fallback
    }
};

const Profile = () => {
    const data = useLoaderData<typeof loader>();
    const [showModal, setShowModal] = useState<boolean>(false);


    function toggleModal() {
        setShowModal(!showModal);
    }

    return (
        <>
            <section className={styles.banner}>
                <img src={banner} alt="Profile Banner" />
            </section>
            <div className={styles.actions_container}>
                <div className={styles.actions_wrapper}>
                    <div className={styles.actions}>
                        <Link to="/profile/snippets"><button>Pins</button></Link>
                        <Link to="/profile"><button>Boards</button></Link>
                    </div>
                </div>
                <div className={styles.dropdown_wrapper}>
                    <div className={styles.dropdown}>
                        <button>Create</button>
                        <div className={styles.dropdown_content}>
                            <Link to="/snippets/new" onClick={toggleModal}>Snippet</Link>
                            <Link to="#" onClick={toggleModal}>Board</Link>
                        </div>
                    </div>
                </div>
            </div>
            <section className={styles.container}>
                {data.length > 0 ? (
                    data.map(item => (
                        <Link to={`/profile/board/${item.id}/snippets`} key={item.id} className={styles.board}>
                            <h2>{item.name}</h2>
                            <p>{item.description}</p>
                            <p>User ID: {item.user_id}</p>
                            <p>Pins: {item._count.pins}</p>
                        </Link>
                    ))
                ) : (
                    <p>No boards available.</p>
                )}
            </section>
            <Board open={showModal} toggleModal={toggleModal} ></Board>
        </>
    );
};

export default Profile;
