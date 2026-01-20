import React, { useState } from 'react';
import { User, Mail, Camera, Save, Shield, Loader2, Ruler, Scale } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { User as UserType, ProfileData } from '../types';

interface ProfileProps {
    user: UserType;
    profileData?: ProfileData;
    onUpdateProfile?: (data: Partial<ProfileData>) => Promise<void>;
}

export const Profile: React.FC<ProfileProps> = ({ user, profileData, onUpdateProfile }) => {
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form with profile data
    const [formData, setFormData] = useState({
        age: profileData?.age || 0,
        height_cm: profileData?.height_cm || 0,
        weight_kg: profileData?.weight_kg || 0,
        goal: profileData?.goal || '',
        fitness_level: profileData?.fitness_level || '',
        activity_level: profileData?.activity_level || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onUpdateProfile) {
            setIsSaving(true);
            await onUpdateProfile({
                age: Number(formData.age),
                height_cm: Number(formData.height_cm),
                weight_kg: Number(formData.weight_kg),
                goal: formData.goal,
                fitness_level: formData.fitness_level,
                activity_level: formData.activity_level
            });
            setIsSaving(false);
            alert("Profile updated successfully");
        }
    };

    const glassInputClass = "!bg-white/5 !border !border-white/10 !text-white placeholder:!text-slate-500 focus:!bg-black/20 focus:!border-primary-500/50";

    return (
        <div className="animate-fade-in max-w-4xl mx-auto pb-20 md:pb-0">
            <h2 className="text-3xl font-bold text-white mb-6">Profile Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Avatar & Status */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card rounded-3xl border border-white/5 p-6 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="w-32 h-32 rounded-full border-4 border-white/10 mb-4 relative group cursor-pointer shadow-xl">
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white">{user.username}</h3>
                        <p className="text-slate-400 text-sm mb-4">{user.email}</p>
                    </div>

                    <div className="glass-card rounded-3xl border border-white/5 p-6">
                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider">Current Stats</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-slate-300">Goal</span>
                                <span className="text-white font-medium capitalize">{profileData?.goal || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-slate-300">Level</span>
                                <span className="text-white font-medium capitalize">{profileData?.fitness_level || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-slate-300">Weight Target</span>
                                <span className="text-emerald-400 font-medium">{profileData?.target_weight_kg || 0} kg</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Forms */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-3xl border border-white/5 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="text-primary-500" />
                            <h3 className="text-xl font-bold text-white">Physical Attributes</h3>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Age"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className={glassInputClass}
                                />
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Goal</label>
                                    <select
                                        name="goal"
                                        value={formData.goal}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-black/20 transition-all"
                                    >
                                        <option className="bg-slate-800" value="cut">Cut (Lose Fat)</option>
                                        <option className="bg-slate-800" value="bulk">Bulk (Gain Muscle)</option>
                                        <option className="bg-slate-800" value="maintain">Maintain</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Height (cm)"
                                    name="height_cm"
                                    type="number"
                                    value={formData.height_cm}
                                    onChange={handleChange}
                                    icon={Ruler}
                                    className={glassInputClass}
                                />
                                <Input
                                    label="Weight (kg)"
                                    name="weight_kg"
                                    type="number"
                                    value={formData.weight_kg}
                                    onChange={handleChange}
                                    icon={Scale}
                                    className={glassInputClass}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity Level</label>
                                <select
                                    name="activity_level"
                                    value={formData.activity_level}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-black/20 transition-all"
                                >
                                    <option className="bg-slate-800" value="sedentary">Sedentary</option>
                                    <option className="bg-slate-800" value="light">Light</option>
                                    <option className="bg-slate-800" value="moderate">Moderate</option>
                                    <option className="bg-slate-800" value="active">Active</option>
                                    <option className="bg-slate-800" value="very_active">Very Active</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex justify-end">
                                <Button className="w-full md:w-auto" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Save size={18} className="mr-2" />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="glass-card rounded-3xl border border-white/5 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="text-primary-500" />
                            <h3 className="text-xl font-bold text-white">Account Settings</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                                <div>
                                    <p className="font-medium text-white">Email Address</p>
                                    <p className="text-xs text-slate-400">{user.email}</p>
                                </div>
                                <Button variant="ghost" className="text-sm">Edit</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                                <div>
                                    <p className="font-medium text-white">Password</p>
                                    <p className="text-xs text-slate-400">Last changed 3 months ago</p>
                                </div>
                                <Button variant="outline" className="text-sm py-2 px-4 border-white/10 hover:bg-white/5">Change</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};