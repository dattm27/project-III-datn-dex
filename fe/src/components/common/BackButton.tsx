import { Button } from "antd";
import { useNavigate } from "react-router-dom";
function BackButton() {
    const navigate = useNavigate();
    return (
        <Button
            type="text"
            onClick={() => navigate(-1)}
        >
            ← Back
        </Button>);
}

export default BackButton;