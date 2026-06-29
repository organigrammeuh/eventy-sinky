"use client";

import { useState, useRef } from "react";

type LinkInput = { url: string; type: string };

const LINK_TYPES = ["linkedin", "twitter", "github", "website", "other"];

const emptyLink = (): LinkInput => ({ url: "", type: "linkedin" });

export function BecomeSpeakerModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fullName, setFullName] = useState("");
    const [biography, setBiography] = useState("");
    
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [links, setLinks] = useState<LinkInput[]>([emptyLink()]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setFullName("");
        setBiography("");
        setProfilePicture(null);
        setPreviewUrl(null);
        setLinks([emptyLink()]);
        setError(null);
    };

    const handleClose = () => {
        setOpen(false);
        setSuccess(false);
        resetForm();
    };

    const updateLink = (index: number, field: keyof LinkInput, value: string) => {
        setLinks((prev) =>
            prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
        );
    };

    const addLink = () => setLinks((prev) => [...prev, emptyLink()]);

    const removeLink = (index: number) =>
        setLinks((prev) => prev.filter((_, i) => i !== index));

    const handleFileChange = (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file (png, jpg, webp).");
            return;
        }
        setProfilePicture(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
    };

    const handleSubmit = async () => {
        setError(null);
        if (!fullName.trim()) {
            setError("Full name is required.");
            return;
        }

        const validLinks = links.filter((l) => l.url.trim() !== "");

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", fullName.trim());
            formData.append("biography", biography.trim());
            
            if (profilePicture) {
                formData.append("profilePicture", profilePicture);
            }
            
            formData.append("links", JSON.stringify(validLinks));

            const res = await fetch("/api/speaker-requests", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "An error occurred while sending.");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mt-16 flex justify-center">
                <button
                    onClick={() => setOpen(true)}
                    className="px-8 py-3 rounded-full font-semibold text-sm bg-primary text-white hover:opacity-90 transition-opacity"
                >
                    Become a Speaker
                </button>
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <div className="glass border border-card-border/40 rounded-3xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">

                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-white/40 hover:text-white/80 text-xl leading-none"
                        >
                            ✕
                        </button>

                        {success ? (
                            <div className="text-center py-8 flex flex-col items-center gap-4">
                                <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold gradient-brand-text">
                                    Application sent!
                                </h2>
                                <p className="text-sm text-white/60 max-w-xs leading-relaxed">
                                    Your request has been successfully received. Our team will
                                    review it as soon as possible.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="mt-4 px-6 py-2 rounded-full bg-primary text-white text-sm hover:opacity-90 transition-opacity"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold gradient-brand-text mb-1">
                                    Become a Speaker
                                </h2>
                                <p className="text-sm text-white/50 mb-6">
                                    Fill out this form, and your application will be
                                    reviewed by our team.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-white/60 uppercase tracking-widest">
                                            Full Name <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="John Doe"
                                            className="bg-white/5 border border-card-border/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/60"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-white/60 uppercase tracking-widest">
                                            Biography
                                        </label>
                                        <textarea
                                            value={biography}
                                            onChange={(e) => setBiography(e.target.value)}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            className="bg-white/5 border border-card-border/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/60 resize-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-white/60 uppercase tracking-widest mb-1">
                                            Profile Picture
                                        </label>
                                        
                                        <input 
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={(e) => handleFileChange(e.target.files?.[0])}
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                handleFileChange(e.dataTransfer.files?.[0]);
                                            }}
                                            className="border-2 border-dashed border-primary/40 hover:border-primary/80 bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                                        >
                                            {previewUrl ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <img 
                                                        src={previewUrl} 
                                                        alt="Preview" 
                                                        className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                                                    />
                                                    <span className="text-xs text-white/60">Change image ({profilePicture?.name})</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-xs text-white/60">
                                                        Drag and drop your image here or <span className="text-primary font-medium">browse</span>
                                                    </span>
                                                    <span className="text-[10px] text-white/30">PNG, JPG, WEBP up to 5 MB</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs text-white/60 uppercase tracking-widest">
                                            Links
                                        </label>
                                        {links.map((link, i) => (
                                            <div key={i} className="flex gap-2">
                                                <select
                                                    value={link.type}
                                                    onChange={(e) => updateLink(i, "type", e.target.value)}
                                                    className="bg-white/5 border border-card-border/40 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/60"
                                                >
                                                    {LINK_TYPES.map((t) => (
                                                        <option key={t} value={t} className="bg-black text-white">
                                                            {t}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) => updateLink(i, "url", e.target.value)}
                                                    placeholder="https://..."
                                                    className="flex-1 bg-white/5 border border-card-border/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/60"
                                                />
                                                {links.length > 1 && (
                                                    <button
                                                        onClick={() => removeLink(i)}
                                                        className="text-white/30 hover:text-white/70 px-2"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={addLink}
                                            className="text-xs text-primary/70 hover:text-primary text-left mt-1 transition-colors"
                                        >
                                            + Add a link
                                        </button>
                                    </div>

                                    {error && (
                                        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="mt-2 w-full py-3 rounded-full bg-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                                    >
                                        {loading ? "Sending..." : "Submit Application"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}