"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ImageField } from "@/components/ui/image-field";
import { ApiError, apiSend } from "@/lib/api";
import { CATEGORY_NAMES, SERVICE_MODES } from "@/lib/constants";
import type { Service, ServiceCategory, ServiceMode } from "@/lib/types";

interface ServiceFormProps {
  initial?: Service;
  onSaved: (service: Service) => void;
  onCancel?: () => void;
}

export function ServiceForm({ initial, onSaved, onCancel }: ServiceFormProps) {
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<ServiceCategory>(initial?.category ?? "Smartphone");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [basePrice, setBasePrice] = useState(
    initial ? String(initial.basePrice) : ""
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    initial?.estimatedDuration ?? ""
  );
  const [serviceMode, setServiceMode] = useState<ServiceMode>(
    initial?.serviceMode ?? "Home Visit"
  );
  const [serviceArea, setServiceArea] = useState(initial?.serviceArea ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (title.trim().length < 5) return toast.error("Title must be at least 5 characters");
    if (description.trim().length < 20)
      return toast.error("Description must be at least 20 characters");
    if (!(Number(basePrice) > 0)) return toast.error("Base price must be greater than 0");
    if (!estimatedDuration.trim()) return toast.error("Estimated duration is required");
    if (serviceArea.trim().length < 2) return toast.error("Service area is required");
    if (!image) return toast.error("Please upload a service image");

    const payload = {
      title: title.trim(),
      category,
      description: description.trim(),
      basePrice: Number(basePrice),
      estimatedDuration: estimatedDuration.trim(),
      serviceMode,
      serviceArea: serviceArea.trim(),
      image,
    };

    setSubmitting(true);
    try {
      const response = editing
        ? await apiSend<Service>(`/api/services/${initial!.id}`, payload, "PATCH")
        : await apiSend<Service>("/api/services", payload);

      toast.success(
        editing
          ? "Service updated and sent back for approval"
          : "Service submitted — waiting for admin approval"
      );
      onSaved(response.data);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not save the service");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="svc-title">
          Service title
        </label>
        <input
          id="svc-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. iPhone Screen Replacement"
          className="input"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="svc-category">
            Category
          </label>
          <select
            id="svc-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as ServiceCategory)}
            className="input"
          >
            {CATEGORY_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="svc-mode">
            Service mode
          </label>
          <select
            id="svc-mode"
            value={serviceMode}
            onChange={(event) => setServiceMode(event.target.value as ServiceMode)}
            className="input"
          >
            {SERVICE_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="svc-description">
          Description
        </label>
        <textarea
          id="svc-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder="What does this service include? Mention warranty, parts and process."
          className="input resize-none"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="svc-price">
            Base price (USD)
          </label>
          <input
            id="svc-price"
            type="number"
            min="1"
            step="1"
            value={basePrice}
            onChange={(event) => setBasePrice(event.target.value)}
            placeholder="89"
            className="input"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="svc-duration">
            Estimated duration
          </label>
          <input
            id="svc-duration"
            value={estimatedDuration}
            onChange={(event) => setEstimatedDuration(event.target.value)}
            placeholder="2-3 hours"
            className="input"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="svc-area">
            Service area
          </label>
          <input
            id="svc-area"
            value={serviceArea}
            onChange={(event) => setServiceArea(event.target.value)}
            placeholder="Mirpur, Dhaka"
            className="input"
            required
          />
        </div>
      </div>

      <ImageField
        value={image}
        onChange={setImage}
        label="Service image"
        hint="Uploaded to ImgBB · shown on the service card"
      />

      <div className="flex flex-wrap justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" className="btn-outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Submit for approval"}
        </button>
      </div>
    </form>
  );
}
