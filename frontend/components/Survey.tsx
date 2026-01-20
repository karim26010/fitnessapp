import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { ProfileData } from '../types';
import { Scale, Ruler, Calendar, Droplets } from 'lucide-react';

interface SurveyProps {
    currentStats?: ProfileData;
    onUpdate: (stats: Partial<ProfileData>) => Promise<void>;
}

export const Survey: React.FC<SurveyProps> = ({ currentStats, onUpdate }) => {
    // Safe defaults if stats aren't loaded yet
    const [formData, setFormData] = useState<Partial<ProfileData>>(currentStats || {
        weight_kg: 0,
        height_cm: 0,
        age: 0,
        gender: 'male',
        activity_level: 'sedentary',
        water_target_ml: 2000
    });

    const [activeTab, setActiveTab] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'activity_level' || name === 'gender' || name === 'goal') ? value : Number(value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onUpdate(formData);
        setIsSaving(false);
    };

    const glassInputClass = "!bg-white/5 !border !border-white/10 !text-white placeholder:!text-slate-500 focus:!bg-black/20 focus:!border-primary-500/50";

    return (
        <div className="max-w-3xl mx-auto animate-fade-in pb-20 md:pb-0">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Update Your Metrics</h2>
                <p className="text-slate-400">Accurate data helps us tailor your fitness plan.</p>
            </div>

            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="flex border-b border-white/10">
                    <button
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 0 ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setActiveTab(0)}
                    >
                        Body Measurements
                    </button>
                    <button
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 1 ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setActiveTab(1)}
                    >
                        Lifestyle & Goals
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {activeTab === 0 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Weight (kg)"
                                    name="weight_kg"
                                    type="number"
                                    value={formData.weight_kg}
                                    onChange={handleChange}
                                    icon={Scale}
                                    className={glassInputClass}
                                />
                                <Input
                                    label="Height (cm)"
                                    name="height_cm"
                                    type="number"
                                    value={formData.height_cm}
                                    onChange={handleChange}
                                    icon={Ruler}
                                    className={glassInputClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Age"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    icon={Calendar}
                                    className={glassInputClass}
                                />
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-black/20 transition-all"
                                    >
                                        <option className="bg-slate-800" value="male">Male</option>
                                        <option className="bg-slate-800" value="female">Female</option>
                                        <option className="bg-slate-800" value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-4">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity Level</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {['sedentary', 'light', 'moderate', 'active', 'very_active'].map((level) => (
                                        <label
                                            key={level}
                                            className={`
                                        flex items-center p-4 rounded-xl border cursor-pointer transition-all
                                        ${formData.activity_level === level
                                                    ? 'border-primary-500 bg-primary-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
                                    `}
                                        >
                                            <input
                                                type="radio"
                                                name="activity_level"
                                                value={level}
                                                checked={formData.activity_level === level}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${formData.activity_level === level ? 'border-primary-500' : 'border-slate-500'}`}>
                                                {formData.activity_level === level && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-white capitalize">{level.replace('_', ' ')}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Input
                                label="Daily Water Goal (ml)"
                                name="water_target_ml"
                                type="number"
                                value={formData.water_target_ml}
                                onChange={handleChange}
                                icon={Droplets}
                                className={glassInputClass}
                            />
                        </div>
                    )}

                    <div className="mt-8 flex justify-end gap-4">
                        {activeTab === 1 ? (
                            <>
                                <Button type="button" variant="ghost" onClick={() => setActiveTab(0)} className="hover:bg-white/10">Back</Button>
                                <Button type="submit" isLoading={isSaving}>Save Changes</Button>
                            </>
                        ) : (
                            <Button type="button" onClick={() => setActiveTab(1)}>Next Step</Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};