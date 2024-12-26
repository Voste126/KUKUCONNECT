import {
    Typography,
    Box,
    Container,
    Card,
    CardContent,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
        {
            label: "Revenue",
            data: [12000, 19000, 3000, 5000, 20000, 15000],
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
        },
    ],
};

export function Dashboard() {
    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Container>
                <Typography variant="h4" gutterBottom>
                    Welcome Back!
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {/* Cards */}
                    {["Users", "Revenue", "Sales"].map((text, index) => (
                        <Card sx={{ width: 250 }} key={index}>
                            <CardContent>
                                <Typography variant="h6">{text}</Typography>
                                <Typography variant="h4" color="primary">
                                    {index === 0 ? "1,240" : index === 1 ? "$12,400" : "450"}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Revenue Overview
                    </Typography>
                    <Line data={chartData} />
                </Box>
            </Container>
        </Box>
    );
}

export default Dashboard;
