'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null)

    // Create 700 particles
    const particleCount = 700

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3)
        const col = new Float32Array(particleCount * 3)
        const colorWhite = new THREE.Color('#FFFFFF')
        const colorAccent = new THREE.Color('#0066FF')

        for (let i = 0; i < particleCount; i++) {
            // position from -10 to +10 in X, Y, Z
            pos[i * 3] = (Math.random() - 0.5) * 20
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20

            const isAccent = Math.random() > 0.8
            const colToUse = isAccent ? colorAccent : colorWhite
            col[i * 3] = colToUse.r
            col[i * 3 + 1] = colToUse.g
            col[i * 3 + 2] = colToUse.b
        }
        return [pos, col]
    }, [])

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.05
            pointsRef.current.rotation.x += delta * 0.02
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    )
}
