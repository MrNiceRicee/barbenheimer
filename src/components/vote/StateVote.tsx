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
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Textarea } from "~/components/ui/textarea";
import { Loader } from "lucide-react";
// import { atomWithStorage } from "jotai/utils";
// import { useAtomValue } from "jotai";

// const alreadyVoted = atomWithStorage("alreadyVoted", false);

const stateVoteSchema = z.object({
  state: z.enum(stateList).optional(),
  candidate: z.enum(["Barbie", "Oppenheimer"]).optional(),
  message: z.string().max(280).optional(),
});

export function StateVote() {
  const vote = api.states.vote.useMutation();
  // const isAlreadyVoted = useAtomValue(alreadyVoted);
  // const apiContext = api.useContext();
  const { toast } = useToast();
  const [loading] = useState(vote.isLoading);
  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof stateVoteSchema>>({
    resolver: zodResolver(stateVoteSchema),
    defaultValues: {
      state: undefined,
      candidate: undefined,
      message: "",
    },
  });

  useEffect(() => {
    if (vote.isSuccess) {
      setSuccess(true);
      // clear success after 5 seconds
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 1);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [vote.isSuccess]);

  const onSubmit = () => {
    return toast({
      title: "Error",
      description:
        "Voting has ended. Go watch one of the movies. Stop voting here 🤨",
      variant: "destructive",
    });
    // old code below, when voting was still possible
    // if (isAlreadyVoted) {
    //   return toast({
    //     title: "Error",
    //     description: "You have already voted",
    //     variant: "destructive",
    //   });
    // }

    // if (loading) {
    //   return toast({
    //     title: "Please wait",
    //     description: "The vote is still being processed",
    //   });
    // }
    // setLoading(true);
    // try {
    //   if (!values.state) {
    //     return form.setError("state", {
    //       type: "manual",
    //       message: "Please select a state",
    //     });
    //   }
    //   if (!values.candidate) {
    //     return form.setError("candidate", {
    //       type: "manual",
    //       message: "Please select a candidate",
    //     });
    //   }

    //   await Promise.all([
    //     vote.mutateAsync({
    //       state: values.state,
    //       candidate: values.candidate,
    //       message: values.message,
    //       // userTime: new Date().toISOString(),
    //     }),
    //     new Promise((resolve) => setTimeout(resolve, 1000)),
    //   ]);
    //   void apiContext.states.invalidate();
    //   form.reset();
    //   toast({
    //     title: "Success",
    //     description: "Your vote has been submitted",
    //   });
    // } catch (error) {
    //   console.error(error);
    //   if (isTRPCClientError(error)) {
    //     toast({
    //       title: "Error",
    //       description: error.message,
    //       variant: "destructive",
    //     });
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
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
                    key={`${success ? "ok" : ""}-state`}
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
                    // key={`${field.value ?? "default"}-candidate`}
                    key={`${success ? "ok" : ""}-candidate`}
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
              {loading ? (
                <span className="flex animate-pulse items-center justify-center space-x-2">
                  <Loader className="h-6 w-6 animate-spin duration-1000" />
                  <span>sending...</span>
                </span>
              ) : (
                <span className="font-bold tracking-widest">Vote</span>
              )}
            </Button>
          </form>
        </Form>
      </section>
      <div>
        <h2 className="text-center text-2xl font-bold">
          Voting has ended. Go watch the movies!
        </h2>
      </div>
    </>
  );
}
