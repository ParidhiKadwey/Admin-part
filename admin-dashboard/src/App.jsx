import { useState } from 'react'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';

import './App.css'
// import './../assets/css/Homepage.css';
import Homepage from './components/Homepage.jsx';
import Dashboard from './components/Dashboard';
import ContactUsList from './components/ContactUs.jsx';
import AdminUserList from './components/AdminList.jsx';
import FAQManagement from './components/Faq.jsx';
import Forwaderlist from './components/Forwader-list.jsx';
import HSCodeManagement from './components/HSCode.jsx';
import MarketInfo from './components/MarketInfo.jsx';
import MeetingsList from './components/Meetings.jsx';
import PermissionManagement from './components/Premissions.jsx';
 import PressReleaseManagement from './components/PRrelease.jsx';
import SellerList from './components/SellerList.jsx';
import SideBar from './components/SideBar.jsx';
import DocumentUploadComponent  from './components/UploadDocument.jsx';
import VendorList from './components/VendorList.jsx';

import SideNavBar from './components/SideNavBar.jsx';
import UserTable from './components/Cha-List.jsx'
import "./assets/css/All.css";
import VesselList from './components/VesselList.jsx';
import './App.css';



function App() {
  

  return (
   
      <Routes>
        <Route path="/" element={<Navigate to="/Homepage"/>} />
         <Route path="/Dashboard" element={<Dashboard />} />
         <Route path="/Homepage" element={<Homepage />} />
        <Route path="/SideNavBar" element={<SideNavBar />} />
        <Route path="/CustomerAgentList" element={<UserTable />} />

        
        <Route path = "/ContactUs" element ={<ContactUsList />} />
        <Route path = "/AdminList" element ={<AdminUserList />} />
        <Route path = "/FAQ" element ={<FAQManagement />} />
        <Route path = "/ForwarderList" element ={<Forwaderlist />} />
        <Route path = "/HSCODE" element ={<HSCodeManagement />} />
        <Route path = "/MarketInformation" element ={<MarketInfo />} />
        <Route path = "/Meetings" element ={<MeetingsList/>} />
        <Route path = "/Premissions" element ={<PermissionManagement />} />
        <Route path = "/PRRealease" element ={<PressReleaseManagement />} /> 
        <Route path = "/SellerList" element ={<SellerList />} />
        <Route path = "/SideBar" element ={<SideBar />} />
        <Route path = "/UploadDocument" element ={<DocumentUploadComponent/>} />
        <Route path = "/VendorList" element ={<VendorList/>} />
        <Route path = "/VesselList" element ={<VesselList/>} />

       




      </Routes>


  
  );
  
}

export default App



