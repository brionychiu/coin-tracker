import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories';

interface TabsCategoryProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function TabsCategory({ value, onChange }: TabsCategoryProps) {
  return (
    <div className="rounded-md border p-2 shadow md:p-4">
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">支出</TabsTrigger>
          <TabsTrigger value="income">收入</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
            {EXPENSE_CATEGORIES.map(({ icon: Icon, label }, index) => (
              <Button
                key={index}
                variant="tabHover"
                className="flex flex-col items-center gap-1"
                type="button"
                onClick={() => onChange?.(label)}
              >
                <span className="relative flex h-10 w-10 items-center justify-center">
                  {value === label && (
                    <span className="absolute left-0 right-0 top-1 mx-auto h-8 w-8 rounded-full bg-red-04 opacity-80" />
                  )}
                  <Icon className="relative z-10 size-6" />
                </span>
                <p className="z-10 text-xs font-normal">{label}</p>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="income">
          <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
            {INCOME_CATEGORIES.map(({ icon: Icon, label }, index) => (
              <Button
                key={index}
                variant="tabHover"
                className="flex flex-col items-center gap-1"
                type="button"
                onClick={() => onChange?.(label)}
              >
                <span className="relative flex h-10 w-10 items-center justify-center">
                  {value === label && (
                    <span className="absolute left-0 right-0 top-1 mx-auto h-8 w-8 rounded-full bg-green-01 opacity-80" />
                  )}
                  <Icon className="relative z-10 size-6" />
                </span>
                <p className="z-10 text-xs font-normal">{label}</p>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
