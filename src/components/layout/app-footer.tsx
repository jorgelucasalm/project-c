export function AppFooter() {
  return (
    <footer className="bg-primary-container w-full py-xl px-lg mt-auto flex flex-col md:flex-row justify-between items-center gap-md text-on-primary">
      <div className="font-headline text-subheading text-on-primary">
        Sistema de Gestão de Aulas
      </div>
      <p className="font-body text-caption text-on-primary-container opacity-80 text-center md:text-left">
        © {new Date().getFullYear()} Sistema de Gestão de Aulas. Todos os direitos reservados.
      </p>
      <div className="flex gap-md font-body text-caption">
        <a className="text-on-primary-container opacity-80 hover:text-on-primary transition-colors" href="#">
          Privacy Policy
        </a>
        <a className="text-on-primary-container opacity-80 hover:text-on-primary transition-colors" href="#">
          Terms of Service
        </a>
        <a className="text-on-primary-container opacity-80 hover:text-on-primary transition-colors" href="#">
          Contact Support
        </a>
      </div>
    </footer>
  );
}
