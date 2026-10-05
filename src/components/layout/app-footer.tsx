export function AppFooter() {
  return (
    <footer className="bg-primary-container text-on-primary font-body text-caption w-full py-xl px-gutter md:px-lg mt-auto flex flex-col md:flex-row justify-between items-center gap-md border-t border-[#2a2933]">
      <div className="font-headline text-subheading text-on-primary font-bold">English Academy</div>
      <div className="flex flex-wrap justify-center gap-lg">
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
      <div className="text-on-primary-container opacity-80">© 2024 English Academy. All rights reserved.</div>
    </footer>
  );
}
