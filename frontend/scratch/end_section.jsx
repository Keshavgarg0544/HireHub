                                <div className="pt-12 border-t border-slate-100 flex gap-4">
                                    {selectedApplicant.resumeUrl && (
                                        <a 
                                            href={`${BACKEND_URL}${selectedApplicant.resumeUrl}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all"
                                        >
                                            <Download className="w-5 h-5" /> Download Resume
                                        </a>
                                    )}
                                    <a 
                                        href={`mailto:${selectedApplicant.applicant?.email}`}
                                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        <Mail className="w-5 h-5" /> Contact Candidate
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplications;
