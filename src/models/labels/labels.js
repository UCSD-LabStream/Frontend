


const components = [
    {
        name: "LED",
        desc: "Provides a stable and bright light source to illuminate the setup. Its output is used for generating uniform and controlled lighting conditions.",
        minX: -5.44, maxX: -4,
        minY: 0, maxY: 2,
        minZ: -0.6, maxZ: 0.6
    },
    {
        name: "Field Iris",
        desc: "Limits the illuminated area on the target and reduces stray light. It is used to adjust the field of view for optimal contrast.",
        minX: -2.7, maxX: -2,
        minY: 0, maxY: 1.7,
        minZ: -0.6, maxZ: 0.2
    },
    {
        name: "Field Lens",
        desc: "Focuses the light into the condenser, ensuring even and efficient illumination across the field.",
        minX: -1.1, maxX: -0.7,
        minY: 0, maxY: 1.5,
        minZ: -0.6, maxZ: 0.3
    },
    {
        name: "Aperture Iris",
        desc: "Regulates the angular range of the light reaching the target, affecting resolution and contrast.",
        minX: 0.5, maxX: 0.8,
        minY: 0, maxY: 1.5,
        minZ: -0.6, maxZ: 0.2
    },
    {
        name: "Condenser Lens",
        desc: "Directs and condenses light from the LED onto the target, ensuring bright and even illumination.",
        minX: 1.3, maxX: 1.66,
        minY: 0, maxY: 2,
        minZ: -0.6, maxZ: 0.6
    },
    {
        name: "Target",
        desc: "Serves as the primary object in the optical system, generating diffraction patterns or images for study.",
        minX: 1.66, maxX: 1.9,
        minY: 0, maxY: 2,
        minZ: -0.6, maxZ: 0.6
    },
    {
        name: "Objective lens",
        desc: "Magnifies the target and collects light to focus it onto the Fourier or image plane.",
        minX: 2, maxX: 2.5,
        minY: 0, maxY: 1.7,
        minZ: -0.6, maxZ: 0.4
    },
    {
        name: "Filter mask",
        desc: "Blocks certain Fourier components at the Fourier plane and can be used for spatial filtering",
        minX: 2.6, maxX: 2.9,
        minY: 0, maxY: 1.5,
        minZ: -0.6, maxZ: 0.6
    },
    {
        name: "Beamsplitter",
        desc: "Directs part of the light beam to an alternate path for simultaneous observation or measurement.",
        minX: 3.1, maxX: 3.7,
        minY: 0, maxY: 1.7,
        minZ: -0.4, maxZ: 0.1
    },
    {
        name: "Projection Lens",
        desc: "Projects the Fourier transform of the target pattern on the screen or webcam",
        minX: 3.1, maxX: 3.7,
        minY: 0, maxY: 2,
        minZ: -0.8, maxZ: -0.4
    },
    {
        name: "Tube lens",
        desc: "Projects the image from the objective to the viewing screen or camera while maintaining image quality.",
        minX: 3.8, maxX: 4.1,
        minY: 0, maxY: 1.6,
        minZ: -0.6, maxZ: 0.4
    },
    {
        name: "Camera 1",
        desc: "Records images or diffraction patterns for analysis and documentation.",
        minX: 4.8, maxX: 6,
        minY: 0, maxY: 2,
        minZ: -0.6, maxZ: 0.6
    },
    {
        name: "Camera 2",
        desc: "Records images or diffraction patterns for analysis and documentation.",
        minX: 3.1, maxX: 3.7,
        minY: 0, maxY: 1.5,
        minZ: -2.6, maxZ: -1.3
    }
];

export default components;