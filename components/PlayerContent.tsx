"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";

import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
    song,
    songUrl
}) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [originalVolume, setOriginalVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    //Progress bar
    const [progress, setProgress] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false); // New state variable

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const onPlayNext = () => {
        if (player.ids.length === 0){
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong){
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    }

    const onPlayPrevious = () => {
        if (player.ids.length === 0){
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong){
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    };

    const [play, { pause, sound }] = useSound(
        songUrl,
        {
            volume: volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            },
            onpause: () => setIsPlaying(false),
            format: ['mp3']
        }
    );

    useEffect(() => {
        sound?.play();

        return () => {
            sound?.unload();
        }
    }, [sound]);

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    };

    const toggleMute = () => {
        if (volume === 0){
            setVolume(originalVolume);
        } else {
            setOriginalVolume(volume);
            setVolume(0);
        }
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (sound) {
            setIsSeeking(true);
            pause();
            const progressBar = e.currentTarget;
            const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
            const progressPercentage = clickPosition / progressBar.clientWidth;
            const seekTime = progressPercentage * sound.duration();

            sound.seek(seekTime);
            if (isPlaying){
                sound.play();
            }
            setProgress(progressPercentage);
            setIsSeeking(false);
        }
    };

    const updateProgress = () => {
        if (!isSeeking) {
            const currentProgress = (sound?.seek() || 0) / (sound?.duration() || 1);
            setProgress(currentProgress);
        }
    };

    // Update progress continuously using requestAnimationFrame
    const animateProgress = () => {
        updateProgress();
        requestAnimationFrame(animateProgress);
    };
    
    // Update progress based on the current time of the playing song
    useEffect(() => {
        

        // Update progress on play
        sound?.on('play', animateProgress);

        // Clean up the event listener
        return () => {
            sound?.off('play', animateProgress);
        };
    }, [sound, isSeeking, setProgress]);


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isSeeking) {
            handleProgressClick(e); // Continue seeking while dragging
        }
    };

    return(
        <div className="mt-[-1rem]">
            {/* Progress bar */}
            <div
                className="flex w-full items-center cursor-pointer justify-center"
                onClick={handleProgressClick}
                onMouseMove={handleMouseMove}
            >
                <div className="flex items-center w-full justify-center rounded-full overflow-hidden">
                    <div className="flex-grow h-1.5 bg-gray-800">
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 h-full mt-3">
                <div className="flex w-full justify-start">
                    <div className="flex items-center gap-x-4">
                        <MediaItem data={song}/>
                        <LikeButton songId={song.id}/>
                    </div>
                </div>

                <div className="flex md:hidden col-auto w-full justify-end items-center">
                    <div onClick={handlePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
                        <Icon size={30} className="text-black"/>
                    </div>
                </div>

                <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
                    <AiFillStepBackward onClick={onPlayPrevious} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition"/>
                    <div onClick={handlePlay} className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer">
                        <Icon size={30} className="text-black"/>
                    </div>
                    <AiFillStepForward onClick={onPlayNext} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" />
                </div>

                <div className="hidden md:flex w-full justify-end pr-2">
                    <div className="flex items-center gap-x-2 w-[120px]">
                        <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={34}/>
                        <Slider 
                            value={volume}
                            onChange={(value) => setVolume(value)}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PlayerContent;