import { AppShell, Button,NavLink } from '@mantine/core';
import {  useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <>
        <AppShell.Navbar p="md" style={{gap: "10px"}}>
            <Button onClick={() => navigate('/')} style={{margin: '5px'}}>Home</Button>
            <Button onClick={() => navigate('/about')} style={{margin: '5px'}}>About</Button>
            <Button onClick={() => navigate('/contact')} style={{margin: '5px'}}>Contact</Button>
            <NavLink
                label="Text compontent"
                onClick={() => navigate('/text')}
                style={{margin: '5px'}}
            />
            <NavLink
                label="Button compontent"
                onClick={() => navigate('/button')}
                style={{margin: '5px'}}/>

        </AppShell.Navbar>
    </>
    );
    }
export default Navbar