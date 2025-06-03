"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormInput,
  FormTextarea,
  FormSelect,
} from "@/components/ui/form-field";
import { SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import type { Subscription, Category } from "@/lib/types";
import {
  subscriptionSchema,
  type SubscriptionFormData,
} from "@/lib/validations";
import { format } from "date-fns";
import { Sparkles, AlertCircle } from "lucide-react";

interface SubscriptionFormProps {
  subscription?: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SubscriptionForm({
  subscription,
  open,
  onOpenChange,
  onSuccess,
}: SubscriptionFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitError, setSubmitError] = useState("");

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (subscription) {
      reset({
        name: subscription.name,
        cost: subscription.cost.toString(),
        billing_cycle: subscription.billing_cycle,
        next_payment_date: format(
          new Date(subscription.next_payment_date),
          "yyyy-MM-dd"
        ),
        category_id: subscription.category_id || "",
        description: subscription.description || "",
        website_url: subscription.website_url || "",
      });
    } else {
      reset({
        name: "",
        cost: "",
        billing_cycle: "monthly",
        next_payment_date: "",
        category_id: "",
        description: "",
        website_url: "",
      });
    }
  }, [subscription, reset]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (data) setCategories(data);
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    setLoading(true);
    setSubmitError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const subscriptionData = {
        name: data.name,
        cost: Number.parseFloat(data.cost),
        billing_cycle: data.billing_cycle,
        next_payment_date: data.next_payment_date,
        category_id: data.category_id || null,
        description: data.description || null,
        website_url: data.website_url || null,
        user_id: user.id,
      };

      console.log("got to this point");
      console.log(subscriptionData);
      if (subscription) {
        const { error } = await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("id", subscription.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("subscriptions")
          .insert([subscriptionData]);
        if (error) throw error;
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving subscription:", error);
      setSubmitError("Failed to save subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {subscription ? "Edit Subscription" : "Add New Subscription"}
          </DialogTitle>
          <DialogDescription className="text-neutral-600">
            {subscription
              ? "Update your subscription details."
              : "Add a new subscription to track."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField label="Service Name" error={errors.name?.message} required>
            <FormInput
              {...register("name")}
              placeholder="Netflix, Spotify, etc."
              error={errors.name?.message}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Cost ($)" error={errors.cost?.message} required>
              <FormInput
                {...register("cost")}
                type="number"
                step="0.01"
                placeholder="9.99"
                error={errors.cost?.message}
              />
            </FormField>
            <FormField
              label="Billing Cycle"
              error={errors.billing_cycle?.message}
              required
            >
              <Controller
                name="billing_cycle"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    error={errors.billing_cycle?.message}
                  >
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </FormSelect>
                )}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Next Payment"
              error={errors.next_payment_date?.message}
              required
            >
              <FormInput
                {...register("next_payment_date")}
                type="date"
                error={errors.next_payment_date?.message}
              />
            </FormField>
            <FormField label="Category" error={errors.category_id?.message}>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    placeholder="Select category"
                    error={errors.category_id?.message}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </FormSelect>
                )}
              />
            </FormField>
          </div>

          <FormField label="Website URL" error={errors.website_url?.message}>
            <FormInput
              {...register("website_url")}
              type="url"
              placeholder="https://example.com"
              error={errors.website_url?.message}
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <FormTextarea
              {...register("description")}
              placeholder="Additional notes about this subscription"
              error={errors.description?.message}
              rows={3}
            />
          </FormField>

          {submitError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <DialogFooter className="gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-neutral-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? "Saving..." : subscription ? "Update" : "Add"}{" "}
              Subscription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
