import { useState, useEffect } from 'react'

interface Props {
	words: string[]
	interval?: number
}

export default function RotatingText({ words, interval = 3000 }: Props) {
	const [index, setIndex] = useState(0)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		setVisible(false)
		const timer = setTimeout(() => setVisible(true), 50)
		return () => clearTimeout(timer)
	}, [index])

	useEffect(() => {
		if (!words.length) return
		const timer = setInterval(() => {
			setIndex((prev) => (prev + 1) % words.length)
		}, interval)
		return () => clearInterval(timer)
	}, [words, interval])

	return (
		<span
			style={{
				display: 'inline-block',
				opacity: visible ? 1 : 0,
				transform: visible ? 'translateY(0)' : 'translateY(8px)',
				transition: 'opacity 0.8s ease, transform 0.8s ease',
			}}
		>
			{words[index]}
		</span>
	)
}
