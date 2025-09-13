"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Settings, Folder, FileText, Play, User } from "lucide-react"

interface SearchResult {
    id: string
    type: "person" | "folder" | "file" | "video" | "chat" | "list"
    title: string
    subtitle?: string
    avatar?: string
    status?: "active" | "offline"
    statusTime?: string
    fileCount?: number
    location?: string
    editTime?: string
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost"
    size?: "default" | "sm"
    children: React.ReactNode
}

function Button({ variant = "default", size = "default", className = "", children, ...props }: ButtonProps) {
    const baseClasses =
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variantClasses = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    }

    const sizeClasses = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
    }

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
            {children}
        </button>
    )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

function Input({ className = "", ...props }: InputProps) {
    return (
        <input
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    )
}

interface AvatarProps {
    className?: string
    children: React.ReactNode
}

function Avatar({ className = "", children }: AvatarProps) {
    return <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> { }

function AvatarImage({ className = "", ...props }: AvatarImageProps) {
    return <img className={`aspect-square h-full w-full ${className}`} {...props} />
}

interface AvatarFallbackProps {
    children: React.ReactNode
    className?: string
}

function AvatarFallback({ children, className = "" }: AvatarFallbackProps) {
    return (
        <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
            {children}
        </div>
    )
}

interface BadgeProps {
    variant?: "default" | "secondary"
    className?: string
    children: React.ReactNode
}

function Badge({ variant = "default", className = "", children }: BadgeProps) {
    const baseClasses =
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

    const variantClasses = {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    }

    return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>
}

interface SwitchProps {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    className?: string
}

function Switch({ checked, onCheckedChange, className = "" }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-primary" : "bg-input"
                } ${className}`}
        >
            <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"
                    }`}
            />
        </button>
    )
}

const mockResults: SearchResult[] = [
    {
        id: "1",
        type: "person",
        title: "HR",
        subtitle: "Unactivated",
        avatar: "/ironman.jpg",
        status: "offline",
    },
    {
        id: "2",
        type: "person",
        title: "Rudraksh Jhaveri",
        subtitle: "Active 1 min ago",
        avatar: "/spiderman.jpg",
        status: "offline",
        statusTime: "1w ago",
    },
    {
        id: "3",
        type: "file",
        title: "rudraksh_jhaveri_presentation.ppt",
        location: "Presentations",
        editTime: "12 min ago",
    },
    {
        id: "4",
        type: "person",
        title: "Manager",
        subtitle: "Active 1 hr ago",
        avatar: "/ben.jpg",
        status: "offline",
        statusTime: "1w ago",
    },
    {
        id: "5",
        type: "video",
        title: "rudraksh_video.mp4",
        location: "Videos",
        editTime: "1y ago",
    },
    {
        id: "6",
        type: "folder",
        title: "Secret Folder",
        subtitle: "12 Files",
        location: "Projects",
        editTime: "2m ago",
        fileCount: 12,
    },
    {
        id: "7",
        type: "chat",
        title: "Rudraksh Jhaveri Chat",
        subtitle: "Last message 2h ago",
    },
    {
        id: "8",
        type: "list",
        title: "Project List",
    },
]

export function SearchInterface() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<SearchResult[]>([])
    const [showSettings, setShowSettings] = useState(false)
    const [contentFilters, setContentFilters] = useState({
        files: true,
        people: true,
        chats: false,
        lists: false,
    })
    const settingsRef = useRef<HTMLDivElement>(null)

    const getFilteredResults = () => {
        let filtered = mockResults.filter((result) => {
            return result.title.toLowerCase().includes(searchQuery.toLowerCase())
        })

        if (activeTab === "files") {
            filtered = filtered.filter(
                (result) => result.type === "file" || result.type === "video" || result.type === "folder",
            )
        } else if (activeTab === "people") {
            filtered = filtered.filter((result) => result.type === "person")
        } else if (activeTab === "chat") {
            filtered = filtered.filter((result) => result.type === "chat")
        } else if (activeTab === "list") {
            filtered = filtered.filter((result) => result.type === "list")
        } else {
            filtered = filtered.filter((result) => {
                const matchesFilter =
                    ((result.type === "file" || result.type === "folder" || result.type === "video") && contentFilters.files) ||
                    (result.type === "person" && contentFilters.people) ||
                    (result.type === "chat" && contentFilters.chats) ||
                    (result.type === "list" && contentFilters.lists)
                return matchesFilter
            })
        }

        return filtered
    }

    const allSearchResults = mockResults.filter((result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    const fileCount = allSearchResults.filter(
        (r) => r.type === "file" || r.type === "video" || r.type === "folder",
    ).length
    const peopleCount = allSearchResults.filter((r) => r.type === "person").length
    const chatCount = allSearchResults.filter((r) => r.type === "chat").length
    const listCount = allSearchResults.filter((r) => r.type === "list").length

    const tabs = [
        { id: "all", label: "All", count: allSearchResults.length },
        { id: "files", label: "Files", count: fileCount },
        { id: "people", label: "People", count: peopleCount },
        ...(contentFilters.chats ? [{ id: "chat", label: "Chat", count: chatCount }] : []),
        ...(contentFilters.lists ? [{ id: "list", label: "List", count: listCount }] : []),
    ]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (searchQuery) {
            setIsSearching(true)
            const timer = setTimeout(() => {
                const filtered = getFilteredResults()
                setResults(filtered)
                setIsSearching(false)
            }, 300)
            return () => clearTimeout(timer)
        } else {
            setResults([])
        }
    }, [searchQuery, contentFilters, activeTab])

    const clearSearch = () => {
        setSearchQuery("")
        setResults([])
    }

    const toggleContentFilter = (type: keyof typeof contentFilters) => {
        setContentFilters((prev) => ({
            ...prev,
            [type]: !prev[type],
        }))
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "folder":
                return <Folder className="h-5 w-5 text-muted-foreground" />
            case "file":
                return <FileText className="h-5 w-5 text-muted-foreground" />
            case "video":
                return <Play className="h-5 w-5 text-muted-foreground" />
            default:
                return <User className="h-100 w-5 text-muted-foreground" />
        }
    }

    const getStatusDot = (status?: string) => {
        if (status === "active") {
            return <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
        }
        return null
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-3 sm:p-6">
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden animate-scale-in">
                {/* Search Header */}
                <div className="p-4 pb-3 sm:p-6 sm:pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="pl-9 sm:pl-10 pr-16 sm:pr-20 h-10 sm:h-12 text-base sm:text-lg border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                        {searchQuery && (
                            <Button
                                onClick={clearSearch}
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-8 px-2 sm:px-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                    {!searchQuery && (
                        <div className="mt-2 sm:mt-3 px-2 sm:px-3 animate-fade-in">
                            <div className="flex items-start space-x-2 text-xs sm:text-sm text-muted-foreground/80">
                                <div className="flex-shrink-0 mt-2">
                                    <div className="h-1.5 w-1.5 bg-primary/60 rounded-full"></div>
                                </div>
                                <p className="leading-relaxed">
                                    <span className="font-medium text-muted-foreground">Tip:</span> If you don't find your result, try
                                    starting with{" "}
                                    <span className="font-mono text-xs bg-muted px-1 sm:px-1.5 py-0.5 rounded border text-foreground/80">
                                        "r"
                                    </span>{" "}
                                    to see more options
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filter Tabs */}
                {searchQuery && (
                    <div className="px-4 pb-3 sm:px-6 sm:pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-1 overflow-x-auto scrollbar-hide min-w-0 flex-1 mr-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {tab.label}
                                        <Badge
                                            variant="secondary"
                                            className={`ml-1 sm:ml-2 text-xs ${activeTab === tab.id
                                                ? "bg-background/90 text-foreground border-0"
                                                : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {tab.count}
                                        </Badge>
                                    </button>
                                ))}
                            </div>
                            <div className="relative flex-shrink-0" ref={settingsRef}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1.5 sm:p-2"
                                    onClick={() => setShowSettings(!showSettings)}
                                >
                                    <Settings className="h-4 w-4" />
                                </Button>

                                {showSettings && (
                                    <div className="absolute right-0 top-full mt-2 w-44 sm:w-48 bg-card border border-border rounded-lg shadow-lg z-10 animate-fade-in-up">
                                        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                                    <span className="text-xs sm:text-sm font-medium">Files</span>
                                                </div>
                                                <Switch checked={contentFilters.files} onCheckedChange={() => toggleContentFilter("files")} />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                                    <span className="text-xs sm:text-sm font-medium">People</span>
                                                </div>
                                                <Switch checked={contentFilters.people} onCheckedChange={() => toggleContentFilter("people")} />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-muted-foreground/30" />
                                                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Chats</span>
                                                </div>
                                                <Switch checked={contentFilters.chats} onCheckedChange={() => toggleContentFilter("chats")} />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex flex-col space-y-0.5">
                                                        <div className="h-0.5 bg-muted-foreground/30 rounded" />
                                                        <div className="h-0.5 bg-muted-foreground/30 rounded" />
                                                        <div className="h-0.5 bg-muted-foreground/30 rounded" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Lists</span>
                                                </div>
                                                <Switch checked={contentFilters.lists} onCheckedChange={() => toggleContentFilter("lists")} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {searchQuery && (
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                        {isSearching && (
                            <div className="flex items-center justify-center py-6 sm:py-8">
                                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-primary"></div>
                            </div>
                        )}

                        {!isSearching && results.length > 0 && (
                            <div className="space-y-2 sm:space-y-3">
                                {results.map((result, index) => (
                                    <div
                                        key={result.id}
                                        className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in-up"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {result.type === "person" ? (
                                            <div className="relative">
                                                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                                    <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.title} />
                                                    <AvatarFallback className="text-xs sm:text-sm">{result.title.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {getStatusDot(result.status)}
                                            </div>
                                        ) : result.type === "chat" ? (
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                </div>
                                            </div>
                                        ) : result.type === "list" ? (
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <div className="h-4 w-4 sm:h-5 sm:w-5 flex flex-col space-y-0.5">
                                                    <div className="h-0.5 bg-blue-500 rounded" />
                                                    <div className="h-0.5 bg-blue-500 rounded" />
                                                    <div className="h-0.5 bg-blue-500 rounded" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center">
                                                {getIcon(result.type)}
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-foreground truncate text-sm sm:text-base">{result.title}</div>
                                            <div className="text-xs sm:text-sm text-muted-foreground">
                                                {result.type === "person" ? (
                                                    result.subtitle
                                                ) : result.type === "chat" || result.type === "list" ? (
                                                    result.subtitle
                                                ) : (
                                                    <span>
                                                        {result.location && `in ${result.location}`}
                                                        {result.location && result.editTime && " • "}
                                                        {result.editTime && `Edited ${result.editTime}`}
                                                        {result.fileCount && ` • ${result.fileCount} Files`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isSearching && searchQuery && results.length === 0 && (
                            <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
