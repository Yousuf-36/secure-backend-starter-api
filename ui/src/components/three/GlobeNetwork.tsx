'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GlobeNetwork() {
    const linesRef = useRef<THREE.LineSegments>(null)

    const [positions, indices] = useMemo(() => {
        // Generate an icosahedron geometry
        const geometry = new THREE.IcosahedronGeometry(2.5, 2)
        const EdgesGeometry = new THREE.EdgesGeometry(geometry)
        return [EdgesGeometry.attributes.position.array, EdgesGeometry.index?.array]
    }, [])

    useFrame((state, delta) => {
        if (linesRef.current) {
            linesRef.current.rotation.y += delta * 0.1
            linesRef.current.rotation.x += delta * 0.05
        }
    })

    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#0066FF" />
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={positions}
                        count={positions.length / 3}
                        itemSize={3}
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color={'#0066FF'}
                    transparent
                    opacity={0.3}
                    depthWrite={false}
                />
            </lineSegments>
        </group>
    )
}
