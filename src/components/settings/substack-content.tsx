"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Check, Upload, CloudLightning, FileJson, ArrowRight, Download } from "lucide-react";
import { ImportDialog } from "@/components/subscribers/import-dialog"; // Reuse existing import dialog logic

export default function SubstackIntegrationContent() {
    const [connected, setConnected] = useState(false); // Validated by presence of imported data normally

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Connect Substack</h1>
                <p className="text-lg text-gray-500 max-w-2xl">
                    Stackly works best when synced with your Substack data. Since Substack doesn't have an official API,
                    we use a secure export-import workflow found in most professional newsletter tools.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Connection Status Card */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden md:col-span-2">
                    <CardHeader className="bg-gradient-to-r from-[#FF6719]/10 to-[#FF6719]/5 border-b border-[#FF6719]/10 pb-8 pt-8 px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#FF6719] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#FF6719]/20">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24h12.006v-3.195H4.253V13.946h10.93v5.672a2.336 2.336 0 001.385 2.152c.23.09.475.132.715.132a2.337 2.337 0 002.34-2.336V10.812H1.46zm21.08-3.18H1.459V0h21.08v2.836z" />
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Substack</CardTitle>
                                    <CardDescription className="text-[#FF6719]/80 font-medium">Newsletter Platform</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/80 text-gray-600 hover:bg-white border-0 pointer-events-none">
                                    Integration Active
                                </Badge>
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Subscribers</p>
                                <p className="text-2xl font-bold text-gray-900">-</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Last Sync</p>
                                <p className="text-2xl font-bold text-gray-900">Never</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Status</p>
                                <p className="text-base font-bold text-gray-700">Waiting for data</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex gap-3 items-start">
                            <CloudLightning className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>
                                <strong>Pro Tip:</strong> We are building a Chrome Extension to automate this sync process in real-time.
                                For now, manual CSV import is the most reliable method required by Substack's platform limitations.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Step 1: Export */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden flex flex-col h-full">
                    <CardHeader className="p-6">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 mb-4">1</div>
                        <CardTitle>Export from Substack</CardTitle>
                        <CardDescription>Get your latest subscriber list.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex-1 space-y-4">
                        <ol className="space-y-3 text-sm text-gray-600 list-decimal pl-4 marker:font-bold marker:text-gray-400">
                            <li>Go to your Substack <strong>Settings</strong> page.</li>
                            <li>Scroll down to the <strong>"Export"</strong> section.</li>
                            <li>Click <strong>"Export CSV (Subscribers)"</strong>.</li>
                            <li>Download the file to your computer.</li>
                        </ol>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Button variant="outline" className="w-full rounded-xl gap-2" onClick={() => window.open('https://substack.com/settings', '_blank')}>
                            Open Substack Settings
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>

                {/* Step 2: Import */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden flex flex-col h-full bg-slate-900 text-white">
                    <CardHeader className="p-6">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white mb-4">2</div>
                        <CardTitle className="text-white">Import to Stackly</CardTitle>
                        <CardDescription className="text-gray-400">Upload your CSV file here.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex-1">
                        <div className="border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-white">Drop CSV file here</p>
                                <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        {/* We use a custom button trigger here that opens the actual functional dialog */}
                        <div className="w-full">
                            <ImportDialog trigger={
                                <Button className="w-full rounded-xl gap-2 bg-white text-black hover:bg-gray-200 font-bold">
                                    Select File & Import
                                </Button>
                            } />
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
