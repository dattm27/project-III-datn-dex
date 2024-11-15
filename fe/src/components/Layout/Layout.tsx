import {Header, Footer} from "./Components"
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
  