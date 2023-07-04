import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stateList } from "~/components/shared/useStateParams";
import { Button } from "~/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api, isTRPCClientError } from "~/utils/api";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Textarea } from "~/components/ui/textarea";

const stateVoteSchema = z.object({
  state: z.enum(stateList),
  candidate: z.enum(["Barbie", "Oppenheimer"]),
  message: z.string().max(280).optional(),
});

export function StateVote() {
  const vote = api.states.vote.useMutation();
  const apiContext = api.useContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(vote.isLoading);
  const form = useForm<z.infer<typeof stateVoteSchema>>({
    resolver: zodResolver(stateVoteSchema),
    // defaultValues: {
    // },
  });

  const onSubmit = async (values: z.infer<typeof stateVoteSchema>) => {
    console.log(values);
    setLoading(true);
    try {
      await Promise.all([
        vote.mutateAsync({
          state: values.state,
          candidate: values.candidate,
          message: values.message,
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
      void apiContext.states.invalidate();
      form.reset();
    } catch (error) {
      console.error(error);
      if (isTRPCClientError(error)) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mt-10 flex items-center justify-center pb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select
                  onValueChange={field.onChange as (value: string) => void}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-52">
                    {stateList.map((state) => {
                      return (
                        <SelectItem value={state} key={`select-${state}`}>
                          {state}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a state to vote for your favorite candidate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="candidate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate</FormLabel>
                <Select
                  onValueChange={field.onChange as (value: string) => void}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a candidate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-52">
                    <SelectItem value="Barbie">Barbie</SelectItem>
                    <SelectItem value="Oppenheimer">Oppenheimer</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a candidate to vote for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="write a quick message why you are voting for this candidate"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional. Write a message why you are voting for this
                  candidate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full border">
            {loading ? "Loading..." : "Vote"}
          </Button>
        </form>
      </Form>
    </section>
  );
}
