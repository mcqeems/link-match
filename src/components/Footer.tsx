export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-secondary text-base-content p-4">
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by LinkMatch</p>
      </aside>
    </footer>
  );
}
