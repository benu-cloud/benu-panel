import { createBrowserRouter } from "react-router-dom";
import MainPage from "../Pages/MainPage";
import RemotePage from "../Pages/RemotePage";
import NotFoundPage from "../Pages/NotFoundPage";

export default createBrowserRouter([
    {
        exact: true,
        path: "/",
        element: <MainPage />,
    },
    {
        path: "/:uuid/:id",
        element: <RemotePage />,
    },
    {
        path: "/404",
        element: <NotFoundPage />,
    },
    {
        path: "*",
        element: <NotFoundPage />,
    }
]);