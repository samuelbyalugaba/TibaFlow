export default function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <header>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Reports
          </h1>
          <p className="text-muted-foreground">
            Generate and view hospital reports.
          </p>
        </header>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Reporting
            </h3>
            <p className="text-sm text-muted-foreground">
              This is where reporting features will be.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
