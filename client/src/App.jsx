import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BaseRoute from "./routes";
import { Scrollbars } from "react-custom-scrollbars-2";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const MainApp = () => {
  const location = useLocation();

  const renderThumbVertical = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "#2474dd",
      borderRadius: "31px",
      width: "8px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };
  const isLoginPage = location.pathname === "/user/auth";
  const position = isLoginPage ? "top-center" : "bottom-center";
  
  return (
    <>
      <Scrollbars
        style={{ width: "100%", height: "100vh" }}
        renderThumbVertical={renderThumbVertical}
      >
        <BaseRoute />
        <Toaster
          richColors
          newestOnTop={true}
          closeButton
          headLess
          expand={true}
          position={position}
          toastOptions={position}
        />
      </Scrollbars>
    </>
  );
};

export default App;
