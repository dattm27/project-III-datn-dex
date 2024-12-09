import {Header, Footer} from "./components"
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div  style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      flexGrow: 1 }}>
      <Header />
      <main  style={{ width: '80%', margin: '20px auto 0 auto' }}>
        {children}
      </main >
      <Footer />
    </div>
  );
  
