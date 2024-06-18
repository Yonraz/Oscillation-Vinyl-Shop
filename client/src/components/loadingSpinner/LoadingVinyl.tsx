import './LoadingVinyl.css';

export default function LoadingVinyl() {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
      <div className="vinyl"></div>
    </div>
  );
}