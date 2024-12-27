import React from "react";
import { Loader, Center } from "@mantine/core"; // Or any spinner from your UI library

const LoadingSpinner: React.FC = () => (
  <Center style={{ height: "100vh" }}>
    <Loader size="lg" />
  </Center>
);

export default LoadingSpinner;
