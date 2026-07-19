export default function PowerBI() {
  return (
    <div className="p-6 h-screen">
      <h1 className="text-3xl font-bold mb-4">
        Power BI Dashboard
      </h1>

      <iframe
        title="InsightForge Dashboard"
        src="https://app.powerbi.com/view?r=eyJrIjoiYmM2NjE5YWMtMmZhNy00Nzk1LTljNmMtNTQ1ZGFhNzQzNTRkIiwidCI6ImUxNGU3M2ViLTUyNTEtNDM4OC04ZDY3LThmOWYyZTJkNWE0NiIsImMiOjEwfQ%3D%3D"
        width="100%"
        height="800"
        style={{ border: "none", borderRadius: "12px" }}
        allowFullScreen
      />
    </div>
  );
}