import { useRouter } from "next/router";
import { BaseLayout } from "~/components/layouts/BaseLayout";
import { Header } from "~/components/Header";

export default function StatePage() {
  const router = useRouter();

  return (
    <BaseLayout className="py-5">
      <Header />
      <p>
      </p>
    </BaseLayout>
  );
}
