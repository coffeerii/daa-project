type AlgorithmCardProps = {
  title: string;
  purpose: string;
  input?: string;
  output?: string;
  complexity?: string;
};

export function AlgorithmCard({
  title,
  purpose,
  input,
  output,
  complexity,
}: AlgorithmCardProps) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <p>{purpose}</p>

      {input && (
        <p>
          <strong>Input:</strong> {input}
        </p>
      )}

      {output && (
        <p>
          <strong>Output:</strong> {output}
        </p>
      )}

      {complexity && (
        <p>
          <strong>Complexity:</strong> {complexity}
        </p>
      )}
    </article>
  );
}