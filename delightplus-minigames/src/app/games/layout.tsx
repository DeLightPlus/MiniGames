export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto flex min-h-screen flex-col p-8">
      {children}
    </div>
  );
}