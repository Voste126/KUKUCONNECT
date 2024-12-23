import { Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';
import TextComponent from './Text';
import ButtonComponent from './Button';
const ReactSwitcher = () => {
    return (
        <>
            <Routes>
                <Route path="/text" element={<TextComponent />} />
                <Route path="/button" element={<ButtonComponent />} />
                <Route path="*" element={<NotFound />} />
                
            </Routes>
        </>
    );
}
export default ReactSwitcher