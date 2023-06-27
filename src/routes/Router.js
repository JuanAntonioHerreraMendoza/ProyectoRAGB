import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "../components/Login";
import HomeNav from "../pages/Home";
import Supervisor from "../pages/Supervisor";
import Oficialesviales from "../pages/OficialesViales";
import Reportes from "../pages/Reportes";
import Usuarios from "../pages/Usuarios";
import Configuracion from "../pages/Configuracion";
import RevisionReportes from "../pages/RevisionReportes";
import RevisionMulta from "../pages/RevisionMulta";
import PosiblesUsuarios from "../pages/PosiblesUsuarios";
import RevisionUsuarios from "../pages/RevisionUsuarios";
import Multas from "../pages/Multas"
import NotFound from "../components/NotFound";
import PrivateRoute from "./PrivateRoute";
import AgregarPersonal from "../pages/AgregarPersonal";
import EditarPersonal from "../pages/EditarPersonal";
import AgregarOficialVial from "../pages/AgregarOficialVial";
import EditarOficialVial from "../pages/EditarOficialVial";
function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/home" element={<PrivateRoute><HomeNav /></PrivateRoute>} />
      <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
      <Route path="/supervisor" element={<PrivateRoute><Supervisor /></PrivateRoute>} />
      <Route path="/oficialesViales" element={<PrivateRoute><Oficialesviales /></PrivateRoute>} />
      <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
      <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
      <Route path="/revisionReportes" element={<PrivateRoute><RevisionReportes /></PrivateRoute>} />
      <Route path="/posiblesUsuarios" element={<PrivateRoute><PosiblesUsuarios /></PrivateRoute>} />
      <Route path="/revisionUsuarios" element={<PrivateRoute><RevisionUsuarios /></PrivateRoute>} />
      <Route path="/multas" element={<PrivateRoute><Multas /></PrivateRoute>} />
      <Route path="/revisionMulta" element={<PrivateRoute><RevisionMulta /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/agregarPersonal" element={<PrivateRoute><AgregarPersonal/></PrivateRoute>}/>
      <Route path="/editarPersonal" element={<PrivateRoute><EditarPersonal/></PrivateRoute>}/>
      <Route path="/agregarOficialVial" element={<PrivateRoute><AgregarOficialVial/></PrivateRoute>}/>
      <Route path="/editarOficialVial" element={<PrivateRoute><EditarOficialVial/></PrivateRoute>}/>
    </Routes>
  );
}

export default Router;
