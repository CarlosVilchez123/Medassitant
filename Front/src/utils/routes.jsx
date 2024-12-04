import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import AgendarCita from '../pages/Citas/AgendarCita'
import Preguntas from '../pages/Preguntas/PreguntasFrecuentes'
import Recomendaciones from '../pages/Recomendaciones/RecomendacionesDeVida'
import HomeDoctor from '../pages/HomeDoctor/HomeDoctor'
export const routes = [
    {
        id: 1,
        path: "/",
        element: <Login/>,
    },
    {
        id: 2,
        path: "/home",
        element: <Home/>,
    },
    {
        id: 3,
        path: "/register",
        element: <Register/>,
    },
    {
        id: 4,
        path: "/agendarcita",
        element: <AgendarCita/>,
    },
    {
        id: 5,
        path: "/preguntasfrecuentes",
        element: <Preguntas/>,
    },
    {
        id: 6,
        path: "/recomendacionesdevida",
        element: <Recomendaciones/>,
    },
    {
        id: 6,
        path: "/homedoctor",
        element: <HomeDoctor/>,
    }
]