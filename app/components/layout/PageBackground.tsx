export default function PageBackground({
  children,
  type = "main",
}: {
  children: React.ReactNode;
  type?: "main" | "about" | "contact";
}) {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
 bg-[#FFD6E7]
        text-[#2f2118]
      "
    >
      {/* Page Content */}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}