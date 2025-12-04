const { createClient } = require("@supabase/supabase-js");

// Pastikan variabel ini ada di .env nanti saat deploy
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseBucket = "balwana-storage"; // Ganti sesuai nama bucket Anda di Supabase

const supabase = createClient(supabaseUrl, supabaseKey);

const uploadToSupabase = async (file) => {
  try {
    const timestamp = Date.now();
    // Bersihkan nama file
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileName = `${timestamp}-${sanitizedName}`;

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from(supabaseBucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    // Dapatkan Public URL agar bisa diakses frontend
    const { data: publicData } = supabase.storage
      .from(supabaseBucket)
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (error) {
    throw new Error(`Gagal upload ke Supabase: ${error.message}`);
  }
};

const deleteFromSupabase = async (fileUrl) => {
  try {
    if (!fileUrl) return;
    // Ambil nama file dari URL
    const fileName = fileUrl.split("/").pop();

    const { error } = await supabase.storage
      .from(supabaseBucket)
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.error("Gagal hapus file di Supabase:", error.message);
  }
};

module.exports = { uploadToSupabase, deleteFromSupabase };
