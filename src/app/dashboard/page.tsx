import Navbar from '@/components/layout/Navbar';

export default async function Dashboard() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <p>使用者 ID: </p>
      <p>電子郵件: </p>
    </div>
  );
}
