export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} ChillStream. Desarrollado para la comunidad privada.</p>
      <style jsx>{`
        .footer { padding: 4rem; text-align: center; color: #333; font-size: 0.9rem; }
      `}</style>
    </footer>
  );
}
