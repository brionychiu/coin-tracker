import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories';

export default function TabsCategory() {
  return (
    <div className="rounded-md border p-4 shadow">
      <Tabs defaultValue="expenses" className="w-full max-w-[500px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">支出</TabsTrigger>
          <TabsTrigger value="income">收入</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {EXPENSE_CATEGORIES.map(({ icon: Icon, label }, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center"
              >
                <Icon className="h-6 w-6" />
                <p className="text-sm">{label}</p>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="income">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {INCOME_CATEGORIES.map(({ icon: Icon, label }, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center"
              >
                <Icon className="h-6 w-6" />
                <p className="text-sm">{label}</p>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
